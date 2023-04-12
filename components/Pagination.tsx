// import Router from 'next/router';
import Link from 'next/link';

export const Pagination = ({ totalCount, page, per, url }) => {
  totalCount = totalCount == 0 ? 0 : totalCount
  console.log("totalCount["+totalCount+"] page["+page+"] per[" + per + "]")
  let start = (page - 4) > 0 ? (page - 4) : 1
  let max_page =  Math.ceil(totalCount / per)
  let end = (page - 4) > 0 ? ((Number(page) + 5) < Number(max_page) ? (Number(page) + 5) : Number(max_page)) : Number(max_page)
  console.log("Pagination start["+start+"] end["+end+"] max_page["+max_page+"]")
  const range = (start, end) =>
        [...Array(end - start + 1)].map((_, i) => start + i)
  return (
    <div className="flex sm:flex-row sm-12 mb-12 md:flex-row z-100">
      <div className="md:flex-grow sm:flex-wrap w-1/12 w-full pl-2 flex flex-col items-start text-left">
        <Link href={ `/${url}/`}>
          <a>&lsaquo;&lsaquo;</a>
        </Link>
      </div>
      {range(start, Number(page) - 1).map((number, index) => (
        <div className="md:flex-grow sm:flex-wrap w-1/12 w-full pl-2 flex flex-col items-start text-left">
          <Link href={ `/${url}/?per=${per}&page=${number}`}>
            <a>{number}</a>
          </Link>
        </div>
      ))}
      <div className="md:flex-grow sm:flex-wrap w-1/12 w-full pl-2 flex flex-col items-start text-left">
        <b>{page}</b>
      </div>
      {range(Number(page) + 1, end).map((number, index) => (
        <div className="md:flex-grow sm:flex-wrap w-1/12 w-full pl-2 flex flex-col items-start text-left">
          <Link href={ `/${url}/?per=${per}&page=${number}`}>
            <a>{number}</a>
          </Link>
        </div>
      ))}
      <div className="md:flex-grow sm:flex-wrap w-1/12 w-full pl-2 flex flex-col items-start text-left">
        <Link href={ `/${url}/?per=${per}&page=${max_page}`}>
          <a>&rsaquo;&rsaquo;</a>
        </Link>
      </div>
    </div>
  );
};
