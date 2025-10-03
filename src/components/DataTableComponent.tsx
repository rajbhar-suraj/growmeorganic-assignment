
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';

import React, { useEffect, useRef, useState } from 'react';
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
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState(1)
  const saved = localStorage.getItem("selectedData")
  const [selectedData, setSelectedData] = useState<any>(saved ? JSON.parse(saved) : [])


  const [rowValue, setRowValue] = useState<number | null>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [pendingRowValue, setPendingRowValue] = useState<number | null>(null)
  const opRef = useRef<OverlayPanel | null>(null)

  function selectionHandler(e: any) {

    setSelectedData((prev: any) => {
      const currentPageIds = tableData.map((row: any) => row.id);
      const withoutCurrentPage = prev.filter(
        (p: any) => !currentPageIds.includes(p.id)
      );
      const merged = [...withoutCurrentPage, ...e.value];
      return Array.from(new Map(merged.map((r) => [r.id, r])).values())
    });
  }

  function sheveronHandler(e: React.MouseEvent) {
    opRef.current?.toggle(e)
  }

  function rowSelector() {
    const selected = tableData.slice(0, tableData.length)
    if (rowValue! > tableData.length) {
      console.log("row value greater", rowValue)
      setPendingRowValue(rowValue! - tableData.length)
    }
    const existing: [] = JSON.parse(localStorage.getItem("selectedData") || '[]');
    const updatedData = [...existing, ...selected]
    const nextUnique = Array.from(new Map(updatedData.map(r => [r.id, r])).values());

    setSelectedData(nextUnique)

    opRef.current?.hide()
    setTarget(rowValue)
    setRowValue(null);

  }

  useEffect(() => {
    getData()
  }, [page])

  useEffect(() => {
    if (pendingRowValue) {
      const alreadyCovered = (page - 1) * 12
      if (alreadyCovered >= target!) return;
      console.log("its not covered")

      const selected = tableData.slice(0, pendingRowValue)
      const existing: [] = JSON.parse(localStorage.getItem("selectedData") || '[]');
      const updatedData = [...existing, ...selected]
      const nextUnique = Array.from(new Map(updatedData.map(r => [r.id, r])).values());
      setSelectedData(nextUnique)
      if (pendingRowValue - 12 > 0) {
        setPendingRowValue(pendingRowValue - 12)
      } else {
        setPendingRowValue(0)
      }
    }
  }, [tableData])

  useEffect(() => {
    localStorage.setItem("selectedData", JSON.stringify(selectedData))
  }, [selectedData])

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

  if (loading) return <div className='flex justify-center items-center min-h-screen'><i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
  </div>
  return (
    <div className='max-w-xl sm:max-w-5xl overflow-x-auto mt-20 sm:mt-3'>
      <DataTable
        value={tableData}
        lazy
        paginator rows={12}
        totalRecords={129720}
        first={first}
        onPage={(e) => {
          setFirst(e.first)
          console.log("epage", e.page)
          setPage(e.page! + 1)
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
              <i onClick={sheveronHandler} className="pi pi-chevron-down cursor-pointer"></i>

              <OverlayPanel
                ref={opRef}
                showCloseIcon
                dismissable
                appendTo={typeof window !== 'undefined' ? document.body : undefined}
              >
                <div className='flex flex-col gap-2'>
                  <input type="number" value={rowValue ?? ""} onChange={(e: any) => setRowValue(e.target.value)} className='p-2 w-full text-gray-700 border border-gray-800 rounded-md ' placeholder='type a number' />
                  <button onClick={rowSelector} className='bg-black w-full text-white rounded-md p-2 mt-2'>select rows</button>
                </div>
              </OverlayPanel>
            </div>
          }

        />

        {columns.map((col: any) => (
          <Column key={col.id} field={col.field} header={col.header} />
        ))}
      </DataTable>
    </div>
  )
}

export default DataTableComponent