import react, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form,Button } from 'react-bootstrap';
import { useSelector,useDispatch } from 'react-redux';
import { userLogin } from '../../slices/userSlice';
import { useNavigate } from 'react-router';

function Login() {

    const {
        register,
        handleSubmit,
        formState:{errors}
    } = useForm();

    //get user state from redux
    let {userObj,isError,isLoading,isSuccess,errMsg} = useSelector(state=>state.user);

    //get dispatch function to call action creator functions
    let dispatch = useDispatch();

    //when login form is submitted
    const onFormSubmit=(userCredentrialsObject)=>{
        console.log(userCredentrialsObject)

        if(userCredentrialsObject.userType === "user"){
          //Dispatch the data
          dispatch(userLogin(userCredentrialsObject))
        }

        if(userCredentrialsObject.userType === "admin"){
          alert("Admin development in progesss")
        }
    };

    //get navigate function to navigate programatically
    let navigate = useNavigate();

    //this to be excuted when either isSuccess or isError changed
    useEffect(()=>{
      if(isSuccess) {
        navigate("/signup");
      }
    },[isSuccess, isError]);


    return(
        <div>
            <div className='display-2 text-center text-info'>Login</div>
            <Form className='w-50 mx-auto' onSubmit={handleSubmit(onFormSubmit)}>

              {/*Usertype*/}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Select type of user</Form.Label><br />
              
                <Form.Check inline type="radio" id="user" >
                  <Form.Check.Input type="radio" value="user" {...register("userType",{required:true})}/>
                  <Form.Check.Label>User</Form.Check.Label>
                </Form.Check>

                <Form.Check inline type="radio" id="user" >
                  <Form.Check.Input type="radio" value="admin" {...register("userType",{required:true})}/>
                  <Form.Check.Label>Admin</Form.Check.Label>
                </Form.Check>
                {/*Error validation message for username*/}
                {errors.userType&&<p className='text-danger'>*Select UserType</p>}
              </Form.Group>

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

              <Button variant="danger" type="submit">
                  Login
              </Button>
            </Form>
        </div>
    )
}

export default Login