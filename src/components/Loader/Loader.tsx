import { TailSpin } from 'react-loader-spinner'

const Loader = () => {
  return (
    <TailSpin
      height={60}
      width={60}
      color="#858585"
      ariaLabel="loading"
    />
  )
}

export default Loader