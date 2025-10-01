
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import axios from 'axios';


//Fields: title, place_of_origin, artist_display, inscriptions, date_start, date_end
const columns = [
  { id: 1, field: "title", header: "Title" },
  { id: 2, field: "place_of_origin", header: "Origin" },
  { id: 3, field: "artist_display", header: "Artist-Display" },
  { id: 4, field: "inscriptions", header: "Inscriptions" },
  { id: 5, field: "date_start", header: "Start" },
  { id: 6, field: "date_end", header: "End" },

]


const DataTableComponent = () => {
  const [tableData, setTableData] = useState<any>([]);
  const [loading, setLoading] = useState(true)

  async function getData() {
    try {
      const response = await axios.get("https://api.artic.edu/api/v1/artworks?page=1");
      console.log(response.data.data)
      setTableData(response.data.data)
    } catch (error) {
      console.log("Error while fetching table data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  if (loading) return <div className='flex justify-center items-center min-h-screen'>Loading...</div>
  return (
<div className="flex justify-center items-center min-h-screen  p-6">
  <div className="w-full max-w-5xl">
    <DataTable
      size="large"
      value={tableData}
      tableStyle={{ minWidth: '50rem' }}
    >
      {columns.map((col: any) => (
        <Column key={col.id} field={col.field} header={col.header} />
      ))}
    </DataTable>
  </div>
</div>

  )
}

export default DataTableComponent

/*

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from './service/ProductService';

export default function BasicDemo() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        ProductService.getProductsMini().then(data => setProducts(data));
    }, []);

    return (
        <div className="card">
            <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
                <Column field="code" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="quantity" header="Quantity"></Column>
            </DataTable>
        </div>
    );
}
        
*/
