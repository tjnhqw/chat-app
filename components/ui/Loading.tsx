import Image from 'next/image'



function Loading({ size = 100 }: { size: number }) {
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <Image priority width={size} height={size} src={'/logo.svg'} alt='logo'
        className='animate-pulse duration-700' />
    </div>
  )
}

export default Loading