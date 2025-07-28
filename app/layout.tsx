import { Poppins, Montserrat } from 'next/font/google'; 

const poppins = Poppins({ 
 subsets: ['latin'], 
 display: 'swap', 
 variable: '--font-poppins', 
 weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] 
}); 

const montserrat = Montserrat({ 
 subsets: ['cyrillic'], 
 display: 'swap', 
 variable: '--font-montserrat', 
}); 

export default function RootLayout({ children }) { 
 return ( 
 <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}> 
 <body>{children}</body> 
 </html> 
 ); 
}
