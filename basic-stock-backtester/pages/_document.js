// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100&family=Titillium+Web:wght@400;900&display=swap" rel="stylesheet"></link>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}