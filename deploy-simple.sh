#!/bin/bash

# Running Lights - Enkel SFTP Deploy Script
# Använder standard sftp-klient (finns på de flesta system)
# Laddar upp alla filer varje gång (enklare men mindre effektivt)

set -e

# Färger
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Running Lights - Enkel SFTP Deploy${NC}"
echo "=================================="

# Kontrollera projektfiler
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Fel: Kör scriptet från projektets root-katalog.${NC}"
    exit 1
fi

# SFTP-uppgifter
read -p "SFTP Server (t.ex. ssh.chol.se, ssh.runninglights.se): " SFTP_SERVER
read -p "SFTP Användarnamn: " SFTP_USER
echo -n "SFTP Lösenord: "
read -s FTP_PASS
echo

if [ -z "$SFTP_SERVER" ] || [ -z "$SFTP_USER" ] || [ -z "$FTP_PASS" ]; then
    echo -e "${RED}❌ Server, användarnamn och lösenord krävs.${NC}"
    exit 1
fi

echo -e "${YELLOW}📡 Laddar upp filer till $SFTP_SERVER/rlng...${NC}"

# Skapa SFTP-kommandofil
cat > /tmp/sftp_commands << EOF
mkdir rlng
cd rlng
put index.html
put styles.css
put script.js
put rl2025.pdf
put robots.txt
put sitemap.xml
quit
EOF

# Kör SFTP-uppladdning med sshpass för lösenord
if sshpass -p "$FTP_PASS" sftp -oBatchMode=no -b /tmp/sftp_commands $SFTP_USER@$SFTP_SERVER; then
    echo -e "${GREEN}✅ Uppladdning klar!${NC}"
    echo -e "${BLUE}Webbplatsen borde nu vara tillgänglig på din domän.${NC}"
else
    echo -e "${RED}❌ Uppladdning misslyckades.${NC}"
    exit 1
fi

# Rensa
rm -f /tmp/sftp_commands

echo -e "${GREEN}🎉 Deploy komplett!${NC}"
