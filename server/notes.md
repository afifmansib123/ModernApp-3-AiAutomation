### Commit 1.1 : Server Side code Setup

1. cd server
npm init -y : to get package.json
2. create all dependencies and node_modules 
npm install express cors dotenv mongoose zod @google/generative-ai @anthropic-ai/sdk axios multer sharp bull redis uuid
3. typescript setup :
npm install --save-dev typescript @types/express @types/node @types/multer tsx eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
4. create typescript configuration at -> tsconfig.json 
look at file contents for reference 
5. create .env.local

PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-quotation
GEMINI_API_KEY=your_gemini_key_here
CLAUDE_API_KEY=your_claude_key_here
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

6. create some folders with bash : 
```bash
# Create these folders
mkdir -p src/models
mkdir -p src/services
mkdir -p src/routes
mkdir uploads
```

7. create gitignore

cat > .gitignore << 'EOF'
Dependencies:
node_modules/
package-lock.json
yarn.lock

Environment variables:
.env
.env.local
.env.*.local

IDE:
.vscode/
.idea/
*.swp

OS:
.DS_Store
Thumbs.db

Logs:
logs/
*.log
npm-debug.log*

Build outputs:
dist/
build/

EOF

8. git actions to push the code. 


