
import Navbar from '../components/Navbar'
import TableIssues from '../components/TableIssues'

export default function MainPage() {
  return (
    <div className='bg-green-200 p-2 min-h-screen'>
      <Navbar/>
      <TableIssues/>
    </div>
  )
}
