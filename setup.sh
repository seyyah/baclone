#!/bin/bash
# Baclone Quick Setup Script for Unix/Linux/macOS
# Automated by Antigravity AI

# Text styling
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear
echo -e "${BOLD}=======================================================================${NC}"
echo -e "${BOLD}                 Baclone (Video-to-Backend Reverse Engineer)            ${NC}"
echo -e "${BOLD}                            Setup Wizard (macOS/Linux)                  ${NC}"
echo -e "${BOLD}=======================================================================${NC}"
echo

# 1. Check Node.js installation
echo -e "${BOLD}[1/4] Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo
    echo -e "${RED}ERROR: Node.js is not installed or not added to your PATH!${NC}"
    echo "Please download and install Node.js (v18 or higher) from: https://nodejs.org/"
    echo "After installing, restart your terminal and run setup.sh again."
    echo
    exit 1
fi

NODE_VER=$(node -v)
echo -e "- Node.js is installed (${GREEN}${NODE_VER}${NC})"
echo

# 2. Prompt for Gemini API Key
echo -e "${BOLD}[2/4] Configuring environment variables...${NC}"
echo "To use real video analysis, you need a Google Gemini API Key."
echo "You can get a free key from Google AI Studio: https://aistudio.google.com/"
echo
read -p "Enter your VITE_GEMINI_API_KEY (press Enter to skip and use Mock Mode): " GEMINI_KEY
echo

# Remove quotes if entered by user
GEMINI_KEY=$(echo "$GEMINI_KEY" | tr -d '"')

# 3. Create .env files
if [ -z "$GEMINI_KEY" ]; then
    echo -e "${YELLOW}WARNING: No API key provided. Baclone will run in Mock Mode.${NC}"
    echo "(You can add the key manually to the .env file later)"
    echo "VITE_GEMINI_API_KEY=" > .env
    echo "VITE_GEMINI_API_KEY=" > appvision/.env
else
    echo -e "${GREEN}API Key detected. Configuring real-analysis mode...${NC}"
    echo "VITE_GEMINI_API_KEY=$GEMINI_KEY" > .env
    echo "VITE_GEMINI_API_KEY=$GEMINI_KEY" > appvision/.env
    echo "- Created root .env"
    echo "- Created appvision/.env"
fi
echo

# 4. Install dependencies
echo -e "${BOLD}[3/4] Installing dependencies in appvision...${NC}"
cd appvision || exit 1
npm install
if [ $? -ne 0 ]; then
    echo
    echo -e "${RED}ERROR: Failed to install npm packages!${NC}"
    echo "Please make sure you have an active internet connection and try running setup.sh again."
    echo
    exit 1
fi
cd ..
echo -e "- Dependencies installed ${GREEN}successfully${NC}."
echo

# 5. Success and start instructions
echo -e "${BOLD}[4/4] Setup complete!${NC}"
echo -e "${BOLD}=======================================================================${NC}"
echo -e "${GREEN}${BOLD} Baclone has been set up successfully.${NC}"
echo -e "${BOLD}=======================================================================${NC}"
echo
if [ -z "$GEMINI_KEY" ]; then
    echo -e " Current Mode: ${YELLOW}MOCK MODE (Simulated video analysis)${NC}"
else
    echo -e " Current Mode: ${GREEN}REAL ANALYSIS (Uses Google Gemini API)${NC}"
fi
echo
echo " To start the application:"
echo -e "   1. ${BOLD}cd appvision${NC}"
echo -e "   2. ${BOLD}npm run dev${NC}"
echo
echo " Or run this command directly to start immediately:"
echo -e "   ${BOLD}npm --prefix appvision run dev${NC}"
echo
echo -e " Open ${GREEN}http://localhost:5173${NC} in your browser once the server starts."
echo -e "${BOLD}=======================================================================${NC}"
echo
