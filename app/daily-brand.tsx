"use client";
import Image from "next/image";
import { createContext, useContext, useEffect, useState, type CSSProperties } from "react";
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
 return <label className="footer-theme-select"><span>Colour theme</span><select aria-label="Website colour theme" value={choice??'daily'} onChange={event=>select(event.target.value==='daily'?null:Number(event.target.value))}><option value="daily">Daily theme (automatic)</option>{BRAND_THEMES.map((theme,index)=><option key={theme.name} value={index+1}>{theme.name}</option>)}</select></label>;
}
