import React ,{useState} from 'react';
import {Modal, Button, Form, } from 'react-bootstrap';

//Function Definition:
function DeleteModal({show, onHide, onDelete}){
    //State Management:
   const [PLOID, setPLOID] = useState('');
   const [PLONAME_TH, setPLONAME_TH] = useState('');
   
   //Form Validation:
   //const correctFrom = PLOID.trim() !== '' && PLONAME_TH.trim() !== ''; 

   //Search Handler:
   const handleDelete = async () => {
    const url = `http://localhost:8000/delete?PLOID=${PLOID}&PLONAME_TH=${PLONAME_TH}`;
  
    try {
      const response = await fetch(url, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error performing delete operation', error);
    } finally {
      onHide();
    }
  };
    //Modal Component:

    return(
        <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Delete Data</Modal.Title>
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
                        
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>PLONAME_TH</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter PLONAME THAI"
                        value={PLONAME_TH}
                        onChange={(e) => setPLONAME_TH(e.target.value)}
                        
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='secondary' onClick={onHide}>Close</Button>
            <Button variant='primary' onClick={handleDelete} >Delete</Button>
        </Modal.Footer>
        </Modal>
    )
}
export default DeleteModal;