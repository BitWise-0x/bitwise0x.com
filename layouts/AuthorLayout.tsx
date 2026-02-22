import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <>
      <div className="divide-theme divide-y">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="page-title">About</h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar && (
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className="h-48 w-48 rounded-full"
              />
            )}
            <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">{name}</h3>
            <div className="text-muted">{company}</div>
            <div className="text-muted text-center text-sm leading-relaxed">{occupation}</div>
            <div className="flex space-x-3 pt-6 pb-4">
              <SocialIcon kind="mail" href={`mailto:${email}`} size={5} />
              <SocialIcon kind="github" href={github} size={5} />
              <SocialIcon kind="linkedin" href={linkedin} size={5} />
              <SocialIcon kind="x" href={twitter} size={5} />
              <SocialIcon kind="bluesky" href={bluesky} size={5} />
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-12 pb-8 xl:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
