#!/bin/bash

# Running Lights - Server Cleanup Script
# Rensar bort onödiga filer från servern (.git, deploy-script, etc.)

set -e

# Färger
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              Running Lights - Server Cleanup                 ║"
echo "║         Rensar bort .git och andra onödiga filer            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Kontrollera lftp
if ! command -v lftp &> /dev/null; then
    echo -e "${RED}❌ lftp krävs för detta script.${NC}"
    echo "Installera med: sudo dnf install lftp"
    exit 1
fi

# FTP-uppgifter
echo -e "${BLUE}🔐 FTP-inloggning för cleanup${NC}"
read -p "Användarnamn: " FTP_USER
echo -n "Lösenord: "
read -s FTP_PASS
echo

if [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
    echo -e "${RED}❌ Användarnamn och lösenord krävs.${NC}"
    exit 1
fi

echo -e "${YELLOW}🧹 Rensar onödiga filer från servern...${NC}"

# Cleanup-kommando
lftp -c "
set ftp:ssl-allow no
set ssl:verify-certificate no
set ftp:passive-mode on
set net:timeout 30

open ftp://$FTP_USER:$FTP_PASS@ftp.chol.se

# Gå till rlng-katalog
cd rlng

# Lista filer innan cleanup
echo 'Filer innan cleanup:'
ls -la

# Ta bort onödiga filer och kataloger
rm -rf .git 2>/dev/null || true
rm -f deploy*.sh 2>/dev/null || true
rm -f README.md 2>/dev/null || true
rm -f .DS_Store 2>/dev/null || true
rm -f Thumbs.db 2>/dev/null || true
rm -f *.tmp 2>/dev/null || true
rm -f *.log 2>/dev/null || true

echo ''
echo 'Filer efter cleanup:'
ls -la

quit
"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    ✅ Cleanup klar!                          ║"
    echo "║                                                              ║"
    echo "║  Servern innehåller nu endast webbfiler.                    ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${BLUE}🗑️  Borttagna filer:${NC}"
    echo "   • .git/ katalog"
    echo "   • deploy*.sh scripts"
    echo "   • README.md"
    echo "   • System-filer (.DS_Store, Thumbs.db)"
    echo "   • Temporära filer (*.tmp, *.log)"
    
else
    echo -e "${RED}❌ Cleanup misslyckades.${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Server cleanup komplett!${NC}"
echo -e "${BLUE}💡 Servern innehåller nu endast de filer som behövs för webbplatsen.${NC}"
