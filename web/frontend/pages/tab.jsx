import {Card, Tabs} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import { OrderTableExample } from './orderTable';
import { ProductTableExample } from './productTable';

export default function TabsExample() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 0,
      content: 'Product',
     
      panelID: 'all-products-content-1',
    },
    {
      id: 1,
      content: 'Order',
      panelID: 'all-orders-content-1',
    },
    {
      id: 2,
      content: 'Customer',
      panelID: 'all-customers-content-1',
    },
   
  ];

  return (
    <div>
    <br/>
    <Card>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Card.Section >
        {selected == 0 && <ProductTableExample/>}
          
          {selected == 1 && <OrderTableExample/>}
          {/* {selected == 2 && <Customer />} */}
        </Card.Section>
      </Tabs>
    </Card>
    </div>
  );
}

{/* <DataTableExample/> */}