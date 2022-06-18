import axios from 'axios';
import react from 'react';
import { Form,Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Signup() {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //state for image
  let [img,setImg] = useState(null);

  //on image select
  const onImageSelect = (event) => {

    setImg(event.target.files[0]);
    //setFile(event.target.files[0])
    // console.log(event.target.files[0]);
    // console.log(event);
  };

  const onFormSubmit=(userObj)=>{

    //create FormData object
    let formData = new FormData();
    //apend values to it
    formData.append("userObj",JSON.stringify(userObj));
    formData.append("photo",img);
    formData.append("productsincart",JSON.stringify([]));
    
    //httppost request(using axxios)
    axios.post('http://localhost:8000/user-api/createuser',formData)
    .then((response) => {
      console.log(response);
      alert(response.data.message);
      
      //if user  created
      if(response.data.message==='New user created successfully')
      {
        //navigate to login
        navigate('/login');
      }
    })
    .catch((error) => {
        console.log(error)
        alert("Something went wrong in creating user")
      })
  }

    return(
        <div>
          <div className='display-2 text-center text-info'>Signup</div>
            <Form className='w-50 mx-auto' onSubmit={handleSubmit(onFormSubmit)}>
              {/*Username*/}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter Username" {...register("username",{required:true})} />
                {/*Error validation message for username*/}
                {errors.username&&<p className='text-danger'>*Username is required</p>}
              </Form.Group>

              {/*Password*/}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" {...register("password",{required:true})} />
                {/*Error validation message for password*/}
                {errors.password&&<p className='text-danger'>*Password is required</p>}
              </Form.Group>

              {/*Email*/}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" placeholder="Enter Email" {...register("email",{required:true})} />
                {/*Error validation message for email*/}
                {errors.email&&<p className='text-danger'>*Email is required</p>}
              </Form.Group>

              {/*City*/}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="Enter City" {...register("city",{required:true})} />
                {/*Error validation message for city*/}
                {errors.city&&<p className='text-danger'>*City is required</p>}
              </Form.Group>

              {/*Profile Image*/}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Select Image</Form.Label>
                <Form.Control type="file" {...register("Photo",{required:true})} onChange={(event => onImageSelect(event))} />
                {/*Error validation message for city*/}
                {errors.Photo&&<p className='text-danger'>*Profile Image is required</p>}
              </Form.Group>

              <Button variant="primary" type="submit">
                  Signup
              </Button>
            </Form>
        </div>
    )
}

export default Signup;