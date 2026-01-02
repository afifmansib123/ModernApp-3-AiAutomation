### Commit 2.1 : Client Side Code Setup

1. npx create-next-app@latest client 

### Commit 2.2 : All dependencies

1. install all dependencies :

npm i lucide-react dotenv date-fns react-filepond filepond filepond-plugin-image-exif-orientation filepond-plugin-image-preview framer-motion mapbox-gl lodash react-hook-form zod @hookform/resolvers @reduxjs/toolkit react-redux axios class-variance-authority clsx aws-amplify @aws-amplify/ui-react

### Commit 2.3 : Tailwind Setup

1. install tailwind : npm install -D tailwindcss@^3 postcss autoprefixer npx tailwindcss init -p 
2. initiate tailwind : npx tailwindcss init -p
3. dragged files : global.css to app folder , tailwind.config.ts and tsconfig.json to root. deleted tailwind.config.js.
4. for tailwind animate : npm i tailwindcss-animate

### Commit 2.4 : Shadcn Setup

1. install shadcn components : npx shadcn@latest add avatar badge button card checkbox command dialog dropdown-menu form input label navigation-menu radio-group select separator sheet sidebar skeleton slider switch table tabs textarea tooltip
2. copied the constants to lib folder. 