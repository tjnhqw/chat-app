

type UserDetailsProps = {
  params: {
    userId: string
  }
}


function UserDetails({ params: { userId } }: UserDetailsProps) {
  return (
    <div>UserDetails {userId}</div>
  )
}

export default UserDetails