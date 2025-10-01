
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import axios from 'axios';


//Fields: title, place_of_origin, artist_display, inscriptions, date_start, date_end
const columns = [
  { id: 1, field: "title", header: "Title" },
  { id: 2, field: "place_of_origin", header: "Origin" },
  { id: 3, field: "artist_display", header: "Artist-Display" },
  // { id: 4, field: "inscriptions", header: "Inscriptions" },
  { id: 5, field: "date_start", header: "Start" },
  { id: 6, field: "date_end", header: "End" },
]


const DataTableComponent = () => {
  const [tableData, setTableData] = useState<any>([]);
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0);
  const [first, setFirst] = useState(0)
  const saved = localStorage.getItem("selectedData")
  const [selectedData, setSelectedData] = useState<any>(saved ? JSON.parse(saved) : [])


  function selectionHandler(e: any) {
    setSelectedData(e.value)
    localStorage.setItem("selectedData", JSON.stringify(e.value))
  }

  async function getData() {
    setLoading(true)

    try {
      const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      setTableData(response.data.data)
    } catch (error) {
      console.log("Error while fetching table data", error)
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    getData()
  }, [page])

  if (loading) return <div className='flex justify-center items-center min-h-screen'><i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
  </div>
  return (
    <div className='max-w-5xl'>
      <DataTable
        value={tableData}
        lazy
        paginator rows={12}
        totalRecords={129720}
        first={first}
        onPage={(e) => {
          setFirst(e.first)
          setPage(e.page ?? 0)
        }}


        dataKey="id"
        selection={selectedData}
        onSelectionChange={(e) => selectionHandler(e)}

        scrollable
        scrollHeight='600px'
      >

        <Column selectionMode="multiple"
          header={
            <div className="relative w-full">
              <i className="pi pi-chevron-down"></i>
            </div>
          }
        />

        {columns.map((col: any) => (
          <Column  key={col.id} field={col.field} header={col.header} />
        ))}
      </DataTable>
    </div>
  )
}

export default DataTableComponent