#!/bin/bash

# Script para iniciar o Projeto SOFIS (Backend e Frontend)

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Iniciando Projeto SOFIS ===${NC}"

# Matar processos antigos nas portas se existirem (opcional, cuidado ao usar)
# fuser -k 8000/tcp
# fuser -k 3000/tcp

# Iniciar Backend em background
echo -e "${GREEN}Iniciando Backend PHP na porta 8000...${NC}"
cd backend
php -S 0.0.0.0:8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Voltar para raiz
cd ..

# Iniciar Frontend em background
echo -e "${GREEN}Iniciando Frontend Vite na porta 3000...${NC}"
cd frontend
npm run dev -- --host > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo -e "${BLUE}=== Servidores rodando! ===${NC}"
echo "Backend log: backend.log"
echo "Frontend log: frontend.log"
echo "Para parar os servidores, rode: kill $BACKEND_PID $FRONTEND_PID"

# Manter script rodando
wait
