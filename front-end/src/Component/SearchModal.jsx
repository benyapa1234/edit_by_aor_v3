import React ,{useState} from 'react';
import {Modal, Button, Form, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap';

//Function Definition:
function SearchModal({show, onHide, onSearch}){
    //State Management:
   const [PLOID, setPLOID] = useState('');
   const [PLONAME_TH, setPLONAME_TH] = useState('');
   
   //Form Validation:
   const correctForm = PLOID.trim() !== '' && PLONAME_TH.trim() !== ''; 

   //Search Handler:
   const handleSearch = async () => {
    try {
      const url = `http://localhost:8000/search?PLOID=${PLOID}&PLONAME_TH=${PLONAME_TH}`;
      
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      onSearch(data); // Pass search results to the callback
    } catch (error) {
      console.error('Error performing search', error);
    } finally {
      onHide(); // Close the modal
    }
  };
    //Modal Component:

    return(
        <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Serch Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>PLOID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter PLOID"
                        value={PLOID}
                        onChange={(e) => setPLOID(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>PLONAME_TH</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter PLONAME THAI"
                        value={PLONAME_TH}
                        onChange={(e) => setPLONAME_TH(e.target.value)}
                        required
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='secondary' onClick={onHide}>Close</Button>
            <Button variant='primary' onClick={handleSearch} disabled={!correctForm}>Search</Button>
        </Modal.Footer>
        </Modal>
    );
}
export default SearchModal;
