import React , {Component} from 'react';
import './App.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Select from 'react-select';

const options = [
  { value: 'latest', label: 'latest' },
  { value: 'oldest', label: 'oldest' },
];

let min=0;
let max=10;
export default class App extends Component {
  render(){
    return(
      <div>
      <Search/>
      </div>
    )}
}

class Search extends Component {
  constructor(props) {
     super(props)
     this.state ={
       searchTerm:'',
       items: {},
       isLoaded:false,
       displaycontent:[],
       disableNext:false,
       searched:false,
       notFound:false,
       count:1,
       selectedOption: null
    }
  }

handleChange = selectedOption => {
  this.setState(
    { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)

    );
let temp;
  if(selectedOption.value === 'latest'){
   // console.log('latest')
     temp=this.state.items.slips.sort(function(a,b){ 
     return new Date(b.date) - new Date(a.date);
     });
  }

  else {
      temp=this.state.items.slips.sort(function(a,b){
      return new Date(a.date) - new Date(b.date);
     });

    }
//console.log(temp)
  let obj={
    ...this.state.items,
    slips:temp
    }
//console.log(obj)
  this.setState({
    items:obj,
    count:1
  })

  min=0;
  max=10;

  let result=temp.filter((item,index) => {
  if(index>=min && index<max){
    return item
    }
 })
   
this.setState({
  displaycontent:result
})
};

handlesearchTermchange = (event) => {
  this.setState ({
     searchTerm:event.target.value
})
}

handleSubmit = (e) => {
 e.preventDefault()
 var url = 'https://api.adviceslip.com/advice/search/';
 var fulurl = url+this.state.searchTerm

  fetch(fulurl)
  .then(res => res.json())
  .then(json => {
   this.setState({
     isLoaded:true,
     items: json,
     count:1,
     selectedOption: null
  })

  min=0;
  max=10;
  //console.log(json)

  if(json.total_results){
    this.setState({
     notFound:false
    })
  if(json.total_results>0){
    this.setState({
      searched:true
    })
  }
  if(json.total_results<11){
    this.setState({
      disableNext:true
      })
    }
  else{
    this.setState({
      disableNext:false
      })
    }
    //console.log(json)
  let result=this.state.items.slips.filter((item,index) => {
    if(index>=min && index<max){
      return item
     }
  })
    
 this.setState({
   displaycontent:result
  })
 }
else{
  this.setState({
    notFound:true,
    displaycontent:[],
    items:null,
    searched:false,
    disableNext:false,
  })
}
  })
}

handleNext = (e) => {
  e.preventDefault();
  min+=10;
  max+=10;
  let out=this.state.items.slips.filter((val,index) => {
  if(index>=min && index<max){
    return val
  }
  })
  this.setState({
    displaycontent:out,
    count:this.state.count+1
  }) 

  let temp=this.state.items.total_results-max
    if(Math.sign(temp) === -1 || Math.sign(temp) === 0){
     this.setState ({
       disableNext:true
    })
    }
    else{
     this.setState ({
       disableNext:false
    })
    }
}
  
handlePrevious =(e) => {
  e.preventDefault();
     min-=10;
     max-=10;
  let output=this.state.items.slips.filter((element,index) => {
  if(index>=min && index<max){
    return element
  }
  })
  
  this.setState({
    displaycontent:output,
    count:this.state.count-1
  })

  let temp=this.state.items.total_results-max
  if(Math.sign(temp) === -1 || Math.sign(temp) === 0){
    this.setState ({
      disableNext:true
    })
  }
  else{
    this.setState ({
      disableNext:false
    })
  }
}
                                                                                                                                                                            
render(){
    return(
      <div style={{background:"white",minHeight:"100vh",padding:"2rem"}}>
           <form className="container" onSubmit={this.handleSubmit} >
              <input style={{width:"40%"}}type="text" value={this.state.searchTerm} onChange={this.handlesearchTermchange}></input>
                <button>Search</button>
           </form>
           <div className="container">
              {(this.state.searched) &&
                <Select style={{width:"30%"}}
                value={this.state.selectedOption}
                onChange={this.handleChange}
                options={options}
              />}
           </div>
           <div className="grid-container">
             {this.state.displaycontent.map((content) =>{
            return (
            <div className="grid-item">
            <h5 style={{margin:0}}>{content.advice}</h5>
            <p className="grid-date">{content.date}</p>
           </div>
        )
    })}
      </div>
        {this.state.notFound && <p style={{color:"red",display:"flex",justifyContent:"center"}}>No results found!!</p>}
        {(this.state.searched) &&
        <div className="footer">
        <button disabled={min<=0 ? true : false}onClick={this.handlePrevious}>Previous</button>
        <p style={{marginLeft:"10px",marginRight:"10px"}}>  {this.state.count}  </p>
        {!this.state.disableNext && <button onClick={this.handleNext}>Next</button>}
      </div>}
    </div>
  )}
  } 