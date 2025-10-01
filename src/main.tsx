import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "primeicons/primeicons.css";
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';

createRoot(document.getElementById('root')!).render(  
    <App />
)
