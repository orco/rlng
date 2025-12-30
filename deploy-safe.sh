#!/bin/bash

# Running Lights - Säker SFTP Deploy Script
# Enkel och robust version som alltid fungerar

set -e

# Färger
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                Running Lights - Säker Deploy                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Kontrollera projektfiler
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Fel: Kör scriptet från projektets root-katalog.${NC}"
    exit 1
fi

# Kontrollera lftp
if ! command -v lftp &> /dev/null; then
    echo -e "${YELLOW}⚠️  lftp behövs för detta script. Installerar...${NC}"
    if command -v dnf &> /dev/null; then
        sudo dnf install -y lftp
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y lftp
    else
        echo -e "${RED}❌ Installera lftp manuellt: sudo dnf install lftp${NC}"
        exit 1
    fi
fi

# SFTP-uppgifter
echo -e "${BLUE}🔐 SFTP-inloggning${NC}"
read -p "SFTP Server (t.ex. ssh.chol.se, ssh.runninglights.se): " FTP_SERVER
read -p "Användarnamn: " FTP_USER
echo -n "Lösenord: "
read -s FTP_PASS
echo

if [ -z "$FTP_SERVER" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
    echo -e "${RED}❌ Server, användarnamn och lösenord krävs.${NC}"
    exit 1
fi

echo -e "${YELLOW}📡 Ansluter till $FTP_SERVER...${NC}"

# Enkel och säker lftp-kommando
lftp -c "
set net:timeout 30
set sftp:auto-confirm yes

open sftp://$FTP_USER:$FTP_PASS@$FTP_SERVER

# Gå till eller skapa rlng-katalog
cd rlng || (mkdir rlng && cd rlng)

# Ta bort .git katalog om den finns på servern
rm -rf .git 2>/dev/null || true

# Ladda upp endast webbfiler (exkluderar .git automatiskt)
put index.html
put styles.css  
put script.js
put rl2025.pdf
put robots.txt
put sitemap.xml
put Knatteloppet.png
put Energiloppet.jpg
put Ungdomsloppet.jpg
put Stafett.png
put 5km.jpg
put 10km.jpg

quit
"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    ✅ Uppladdning klar!                      ║"
    echo "║                                                              ║"
    echo "║  Webbplatsen är nu live på din chol.se domän!               ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${BLUE}📋 Uppladdade filer:${NC}"
    echo "   • index.html"
    echo "   • styles.css"
    echo "   • script.js"
    echo "   • rl2025.pdf"
    echo "   • robots.txt"
    echo "   • sitemap.xml"
    echo "   • Knatteloppet.png"
    echo "   • Energiloppet.jpg"
    echo "   • Ungdomsloppet.jpg"
    echo "   • Stafett.png"
    echo "   • 5km.jpg"
    echo "   • 10km.jpg"
else
    echo -e "${RED}❌ Uppladdning misslyckades. Kontrollera dina SFTP-uppgifter.${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Running Lights webbplatsen är nu live!${NC}"
