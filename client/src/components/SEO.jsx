import { Helmet } from 'react-helmet-async'
import { useEffect } from 'react'

const SEO = ({ title, description, keywords }) => {
    useEffect(() => {
        document.title = `${title} | Velvet Luxury Cosmetics`
    }, [title])

    return (
        <Helmet>
            <title>{title} | Velvet Luxury Cosmetics</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:title" content={`${title} | Velvet Luxury Cosmetics`} />
            <meta property="og:description" content={description} />
        </Helmet>
    )
}

export default SEO