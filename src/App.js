import {useState , useEffect } from "react";
import { Card , Button , Row, Col } from 'react-bootstrap';
import InfiniteScroll from "react-infinite-scroll-component";
import {Player} from 'react-simple-player';
import { Calendar , Tags } from 'react-bootstrap-icons';

import logo from './logo.svg';
import useAxios from "axios-hooks" ;

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  const API_URL = process.env.REACT_APP_API_BASE_URL;
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 10 ;

  const [{ data, loading, error }, refetch] = useAxios(`${API_URL}/php/getTimeline.php`);

  const paginated = ( page = currentPage ) => {

    let items = [...data.Timeline] ;

    const offset = perPage * (page - 1);
    const totalPages = Math.ceil(items.length / perPage);
    setCurrentPage(currentPage + 1);
    return items.slice(offset, perPage * page);
  }


  const fetchMoreData = async () => { 

    const page = currentPage + 1 ;
    setCurrentPage(page );
    setFilteredData( previousData => [...previousData , ...paginated(page)] );
  }


  useEffect(() => {
    if(data && data.Timeline ){
      setFilteredData(paginated());
    }
  } , [data]);


  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center">Error!</p>;

  return (
    <div className="wrapper">
      { filteredData && filteredData.length ?

        <div className="d-flex align-items-center justify-content-center">
          <div className="m-2" >

            <InfiniteScroll
              className="mb-3 w-100"
              dataLength={filteredData.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b> &nbsp; </b>
                </p>
              }
              scrollableTarget="scrollableDiv"
              refreshFunction={fetchMoreData}
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
              pullDownToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
              }
              releaseToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
              }
            >
              {filteredData.map((item , index) => (
                <div className="m-4">
                  <Card className="my-card">
                    <Card.Img variant="top" src={`${API_URL}/${item.Image}`} alt={`Missing Image`} />
                    <Card.Body>
                      <Card.Title> {item.Title} </Card.Title>
                      <Card.Text>
                        {item.Description}
                      </Card.Text>

                      <div className="mb-4">
                        { item.Audio && 
                            <Player src={`${API_URL}/${item.Audio}`} height={40} />
                        }
                      </div>

                      <div className="ms-1">
                        <span className="me-3" title="Category"> <Tags /> {item.Category} </span>
                        <span title="Created Date"> <Calendar /> {item.CreateDate} </span>
                      </div>

                    </Card.Body>
                  </Card>
                </div> 
              ))}

            </InfiniteScroll>
          </div>
        </div>

        :

        <div className="text-center">
          <span> no records found ! </span> 
        </div>
      }
    </div>
  );

}

export default App;
