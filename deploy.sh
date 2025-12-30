#!/bin/bash

# Running Lights - SFTP Deploy Script
# Laddar upp projektet till ssh.chol.se/rlng eller ssh.runninglights.se/rlng
# Endast ändrade filer laddas upp för effektivitet

set -e  # Avsluta vid fel

# Färger för output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                  Running Lights Deploy Script                ║"
echo "║                    SFTP Upload till chol.se                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Kontrollera att vi är i rätt katalog
if [ ! -f "index.html" ] || [ ! -f "styles.css" ] || [ ! -f "script.js" ]; then
    echo -e "${RED}❌ Fel: Kan inte hitta projektfiler. Kör scriptet från projektets root-katalog.${NC}"
    exit 1
fi

# Kontrollera att lftp är installerat
if ! command -v lftp &> /dev/null; then
    echo -e "${YELLOW}⚠️  lftp är inte installerat. Installerar...${NC}"
    
    # Försök installera lftp beroende på system
    if command -v dnf &> /dev/null; then
        sudo dnf install -y lftp
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y lftp
    elif command -v yum &> /dev/null; then
        sudo yum install -y lftp
    else
        echo -e "${RED}❌ Kunde inte installera lftp automatiskt. Installera det manuellt och kör scriptet igen.${NC}"
        echo "   Fedora/RHEL: sudo dnf install lftp"
        echo "   Ubuntu/Debian: sudo apt-get install lftp"
        exit 1
    fi
fi

# Fråga efter FTP-uppgifter
echo -e "${BLUE}🔐 SFTP-inloggning${NC}"
read -p "SFTP Server (t.ex. ssh.chol.se, ssh.runninglights.se): " FTP_SERVER
read -p "Användarnamn: " FTP_USER

# Läs lösenord utan att visa det
echo -n "Lösenord: "
read -s FTP_PASS
echo

# Validera att uppgifter är ifyllda
if [ -z "$FTP_SERVER" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
    echo -e "${RED}❌ Server, användarnamn och lösenord krävs.${NC}"
    exit 1
fi
REMOTE_DIR="rlng"
LOCAL_DIR="."

echo -e "${YELLOW}📡 Ansluter till $FTP_SERVER...${NC}"

# Skapa lftp-script för uppladdning
cat > /tmp/lftp_script << EOF
set net:timeout 30
set net:max-retries 3
set sftp:auto-confirm yes

open sftp://$FTP_USER:$FTP_PASS@$FTP_SERVER

# Skapa rlng-katalog om den inte finns (ignorera fel om den redan finns)
mkdir $REMOTE_DIR 2>/dev/null || true

# Gå till remote directory
cd $REMOTE_DIR

# Ta bort .git katalog från servern om den finns
rm -rf .git 2>/dev/null || true

# Synkronisera lokala filer till remote
# --reverse: ladda upp (inte ladda ner) 
# --delete: ta bort filer på remote som inte finns lokalt
# --verbose: visa vad som händer
# --exclude-glob: exkludera vissa filer/kataloger (glob-mönster)
mirror --reverse \\
       --delete \\
       --verbose \\
       --exclude-glob .git \\
       --exclude-glob .git/ \\
       --exclude-glob deploy*.sh \\
       --exclude-glob README.md \\
       --exclude-glob .DS_Store \\
       --exclude-glob Thumbs.db \\
       --exclude-glob cleanup-server.sh \\
       $LOCAL_DIR .

quit
EOF

# Kör FTP-uppladdning
echo -e "${BLUE}🚀 Laddar upp filer...${NC}"

if lftp -f /tmp/lftp_script; then
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    ✅ Uppladdning klar!                      ║"
    echo "║                                                              ║"
    echo "║  Webbplatsen borde nu vara tillgänglig på:                  ║"
    echo "║  https://runninglights.se (eller din chol.se domän)         ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${BLUE}📋 Uppladdade filer:${NC}"
    echo "   • index.html"
    echo "   • styles.css"
    echo "   • script.js"
    echo "   • rl2025.pdf"
    echo "   • robots.txt"
    echo "   • sitemap.xml"
    echo "   • .htaccess"
    
else
    echo -e "${RED}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                     ❌ Uppladdning misslyckades              ║"
    echo "║                                                              ║"
    echo "║  Kontrollera:                                                ║"
    echo "║  • Användarnamn och lösenord är korrekta                    ║"
    echo "║  • Internetanslutning fungerar                              ║"
    echo "║  • SFTP-servern är tillgänglig                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    exit 1
fi

# Rensa temporära filer
rm -f /tmp/lftp_script

echo -e "${GREEN}🎉 Deploy komplett! Running Lights webbplatsen är nu live!${NC}"
echo -e "${BLUE}💡 Tips: Kör detta script igen när du gör ändringar för att uppdatera webbplatsen.${NC}"
