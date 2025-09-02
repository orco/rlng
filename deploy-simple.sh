#!/bin/bash

# Running Lights - Enkel FTP Deploy Script
# Använder standard ftp-klient (finns på de flesta system)
# Laddar upp alla filer varje gång (enklare men mindre effektivt)

set -e

# Färger
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Running Lights - Enkel FTP Deploy${NC}"
echo "=================================="

# Kontrollera projektfiler
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Fel: Kör scriptet från projektets root-katalog.${NC}"
    exit 1
fi

# FTP-uppgifter
read -p "FTP Användarnamn: " FTP_USER
echo -n "FTP Lösenord: "
read -s FTP_PASS
echo

if [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
    echo -e "${RED}❌ Användarnamn och lösenord krävs.${NC}"
    exit 1
fi

echo -e "${YELLOW}📡 Laddar upp filer till ftp.chol.se/rlng...${NC}"

# Skapa FTP-kommandofil
cat > /tmp/ftp_commands << EOF
open ftp.chol.se
user $FTP_USER $FTP_PASS
binary
mkdir rlng
cd rlng
put index.html
put styles.css
put script.js
put rl2025.pdf
put robots.txt
put sitemap.xml
put .htaccess
quit
EOF

# Kör FTP-uppladdning
if ftp -n < /tmp/ftp_commands; then
    echo -e "${GREEN}✅ Uppladdning klar!${NC}"
    echo -e "${BLUE}Webbplatsen borde nu vara tillgänglig på din domän.${NC}"
else
    echo -e "${RED}❌ Uppladdning misslyckades.${NC}"
    exit 1
fi

# Rensa
rm -f /tmp/ftp_commands

echo -e "${GREEN}🎉 Deploy komplett!${NC}"
