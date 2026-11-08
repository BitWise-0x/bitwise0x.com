import NextImage, { ImageProps } from 'next/image'
import { versioned } from 'lib/asset'

const basePath = process.env.BASE_PATH

const Image = ({ src, ...rest }: ImageProps) => (
  <NextImage src={`${basePath || ''}${typeof src === 'string' ? versioned(src) : src}`} {...rest} />
)

export default Image
