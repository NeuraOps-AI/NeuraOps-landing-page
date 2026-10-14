"use client";
import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties } from "react";
import { logoForDate, millisecondsUntilBrandChange } from "./brand-schedule";
import { BRAND_THEMES, themeForLogo } from "./brand-themes";
const BrandContext=createContext(1);
const ThemeChoiceContext=createContext<{choice:number|null;select:(value:number|null)=>void}>({choice:null,select:()=>{}});
export function useDailyTheme(){return themeForLogo(useContext(BrandContext));}
export function DailyBrandProvider({initialLogo,children}:{initialLogo:number;children:React.ReactNode}){
 const [logo,setLogo]=useState(initialLogo);const [choice,setChoice]=useState<number|null>(null);
 useEffect(()=>{let timer:ReturnType<typeof setTimeout>;function sync(){clearTimeout(timer);const now=new Date();setLogo(logoForDate(now));timer=setTimeout(sync,millisecondsUntilBrandChange(now)+100);}function visible(){if(!document.hidden)sync();}sync();document.addEventListener('visibilitychange',visible);try{const value=Number(localStorage.getItem('neuraops-theme'));if(Number.isInteger(value)&&value>=1&&value<=7)setChoice(value);}catch{}return()=>{clearTimeout(timer);document.removeEventListener('visibilitychange',visible);};},[]);
 function select(value:number|null){setChoice(value);try{if(value===null)localStorage.removeItem('neuraops-theme');else localStorage.setItem('neuraops-theme',String(value));}catch{}}
 const activeLogo=choice??logo;const theme=themeForLogo(activeLogo);const style={'--accent':theme.accent,'--accent-dark':theme.accentDark,'--alt':theme.secondary,'--soft':theme.soft,'--tint':theme.tint,'--strong':theme.strong,'--closing':theme.closing} as CSSProperties;
 return <BrandContext.Provider value={activeLogo}><ThemeChoiceContext.Provider value={{choice,select}}><div className="brand-theme" data-theme={activeLogo} style={style}>{children}</div></ThemeChoiceContext.Provider></BrandContext.Provider>;
}
export function DailyLogo({prominent=false,aboveFold=false}:{prominent?:boolean;aboveFold?:boolean}){const logo=useContext(BrandContext);return <span className="original-logo" data-logo={logo}><Image src={`/logos/${logo}_neuraops.svg`} alt="NeuraOps Technologies" width={logo===2?1050:1190} height={logo===2?674:725} sizes={prominent?'240px':'190px'} loading="eager" fetchPriority={aboveFold?'high':'auto'} unoptimized/></span>;}
export function FooterThemePicker(){
 const {choice,select}=useContext(ThemeChoiceContext);
 const activeTheme=useDailyTheme();
 const picker=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{const close=(event:PointerEvent)=>{if(event.target instanceof Node&&!picker.current?.contains(event.target)&&picker.current)picker.current.open=false;};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close);},[]);
 function choose(value:number|null){select(value);if(picker.current){picker.current.open=false;picker.current.querySelector('summary')?.focus();}}
 const swatch=(accent:string,secondary:string)=><span className="theme-palette" aria-hidden="true" style={{background:`linear-gradient(125deg,${accent},${secondary})`}}><i style={{background:accent}}/><i style={{background:secondary}}/></span>;
 return <div className="footer-theme-select"><span id="footer-theme-label">Colour theme</span><details ref={picker} className="theme-dropdown" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();if(picker.current)picker.current.open=false;picker.current?.querySelector('summary')?.focus();}}}><summary aria-labelledby="footer-theme-label theme-current">{swatch(activeTheme.accent,activeTheme.secondary)}<span id="theme-current">{choice===null?'Daily theme':BRAND_THEMES[choice-1].name}</span><span className="theme-chevron" aria-hidden="true">⌃</span></summary><div className="theme-menu" role="group" aria-label="Choose a colour theme"><p>Choose your colour palette</p><button type="button" aria-pressed={choice===null} onClick={()=>choose(null)}>{swatch(activeTheme.accent,activeTheme.secondary)}<span>Daily theme<small>Changes automatically every day</small></span><b aria-hidden="true">{choice===null?'✓':''}</b></button>{BRAND_THEMES.map((theme,index)=><button type="button" key={theme.name} aria-pressed={choice===index+1} onClick={()=>choose(index+1)}>{swatch(theme.accent,theme.secondary)}<span>{theme.name}</span><b aria-hidden="true">{choice===index+1?'✓':''}</b></button>)}</div></details></div>;
}
