import {createContentLoader} from 'vitepress'

export interface Post {
    title: string
    url: string
    date: {
        time: number
        string: string
    }
    html: string
    tags?: string[]
}

declare const data: Post[]
export {data}

export default createContentLoader('blog/**/*.md', {
    transform(raw): Post[] {
        return raw
            .filter(({frontmatter}) => frontmatter.status === 'publish')
            .sort((a, b) => {
                return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
            })
            .map(({url, frontmatter, html}) => ({
                title: frontmatter.title,
                url,
                html,
                date: formatDate(frontmatter.date),
                tags: frontmatter.tags,
            }))
    }
})

function formatDate(raw: string): Post['date'] {
    const date = new Date(raw)
    date.setUTCHours(12)
    return {
        time: +date,
        string: date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
}

