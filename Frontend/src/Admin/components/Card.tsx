import React from 'react'

export default function Card({src, chiffre, text, style}:{src:string, chiffre:string, text:string, style:string}) {
    return (
        <div className={`${style} text-white rounded-lg p-6 shadow-lg text-center flex flex-col justify-between`}>
            <div className="flex items-center justify-center mb-2">
                <img aria-hidden="true" alt="sales-icon" src={src} />
            </div>
            <h2 className="text-2xl font-bold">{chiffre}</h2>
            <p className="text-muted-foreground">{text}</p>
        </div>
    )
}
