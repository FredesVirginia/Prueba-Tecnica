
import { Pagination } from 'rsuite';
import type { Pagination as PaginationType } from '../hooks/useIssues/IResIssues';

interface PaginationProps extends PaginationType {
  onChangePage: (page: number) => void;
}

export default function PaginationComponent(props: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-4 py-4">
      <Pagination
        prev
        last
        next
        first
        size="lg"
        total={props.totalIssues}       
        limit={props.issuesPerPage}     
        activePage={props.currentPage}   
        onChangePage={props.onChangePage} 
                         
           
      />
      
     
    
    </div>
  )
}
