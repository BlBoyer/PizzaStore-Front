import React, {useEffect, useState} from "react";
import styled from "styled-components";
const appUrl = 'http://localhost:5059/pizza';
const Header = styled.div`
  margin-bottom:1em;
  padding:1em;
  display:flex;
  justify-content:space-around;
  font-size:1.5em;
  text-shadow:1px 1px 2px black;
  background-color:orange;
`;
const PizzaFrame = styled.div`
    border: solid 1px gray;
    padding: 10px;
    margin: 15px 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px grey;
    font-family: Arial;
    background-color:red;
`;

const Input = styled.input`
    border: 4px ridge darkred;
    padding: 5px;
    border-radius: 10px;
    background-color:orange;
    box-shadow: 3px 3px 5px 2px darkred;
    text-shadow:1px 1px 2px black;
`;

const Title = styled(Input)`
    text-transform: uppercase;
`;
const Method = styled.button`
   width: 100px;
   margin: 10px;
   background: darkred;
   color: white;
   font-size: 16px;
   padding: 10px;
   border-radius: 5px;
   box-shadow: 3px 3px 5px 2px darkred;
   text-shadow:0px 0px 4px lightgray;
`;
  const Pizza = ({pizza, editable}) => {
    const [data, setData] =useState(pizza);
    const [dirty, setDirty] = useState(false);
    function Update(value, fieldName, obj){
      setData({...obj, [fieldName] : value});
      //see button logic
      setDirty(true);
    }
    async function onSave(){
      setDirty(false);
      //make rest call which we haven't done yet
      try {
        const response = await fetch(`${appUrl}/${data.id}`,{
        method: 'PUT',
        headers:{
        'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
      })
      if (!response.ok){
        console.log(response.status);
      } else {
        //check your route map return
        await response.json().then(data=>console.log(data));
      }
      } catch (err) {
        console.log(err);
      }
    }
    async function onDel()
    {
      try
      {
        const response = await fetch(`${appUrl}/${data.id}`,{
          method: 'Delete',
          headers:{
          'Content-Type':'application/json'
          },
          body: JSON.stringify(pizza)
        });
        if (!response.ok){
          console.log(response.status);
        } else {
          //check your route map return
          await response.json().then(data=>console.log(data));
        }
      } catch (err)
      {
        console.log(err);
        document.location.reload();
      } 
    }
    async function onAdd()
    {
      try
      {
        const response = await fetch(`${appUrl}`,{
          method: 'Post',
          headers:{
          'Content-Type':'application/json'
          },
          body: JSON.stringify(data)
        });
        if (!response.ok){
          console.log(response.status);
        } else {
          //check your route map return
          await response.json().then(data=>console.log(data));
          document.location.reload();
        }
      } catch (err)
      {
        console.log(err);
      } 
    }
    const NewPizza = ()=><React.Fragment><div><Method onClick={onAdd}>Add</Method></div></React.Fragment>;
    const Regular = ()=>
      <React.Fragment>
        {dirty ? 
        <div><Method onClick={onSave}>Save</Method></div> : <div><Method onClick={onDel}>Delete</Method></div>}
      </React.Fragment>;
    return (
    <React.Fragment>
      <PizzaFrame>
      <div>
        <h3><Title onChange={(evt)=>Update(evt.target.value, 'name', data)} value={data.name} /></h3>
        <div><Input onChange={(evt) => Update(evt.target.value, 'description', data)} value={data.description} /></div>
      {editable ? <Regular /> : <NewPizza />}
      </div>
      </PizzaFrame>
    </React.Fragment>
    );
  }
    const App = () => {
      const [pizzas, setPizzas] = useState([]);
      const [create, setCreate] = useState(false);
      useEffect(()=>{
        fetchData();
      },[])
      function fetchData(){
        fetch(appUrl)
        .then(res=>res.json())
        .then(data=>setPizzas(data))
      }
      const data = pizzas.map((pizza, ind) => <Pizza pizza={pizza} editable={true} key={ind} />);
      const openPoster = () => setCreate(true);
      return(
        <React.Fragment>
          <Header>Manage your Pizzas</Header>
          <Input type="button" value="Add a Pizza" onClick={()=>openPoster()} style={{fontSize:"1.2em"}} />
          {create ? <Pizza pizza={{name:"empty", description:"empty"}} editable={false} /> : null}
          {
          (pizzas.length === 0) ? <div>No pizzas</div> :
          <div>{data}</div>
          }
        </React.Fragment>
      )
    }
    export default App;