import React, {Component} from 'react';
import Auth from '../helpers/auth';
import Schedule from './schedule';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

class Home extends Component {
    constructor(props){
        super(props);   
        
        this.cellRendererFunc = this.cellRendererFunc.bind(this);
        this.onCellValueChanged = this.onCellValueChanged.bind(this);
        this.state = {
            columnDefs: [
                {headerName: "Title", field: "title"},
                {headerName: "CUID", field: "cUID"},
                {headerName: "FolderName", field: "foldername"},
                {headerName: "Alias", field: "alias", editable: true},
                {headerName: "Schedule", field: "schedule", cellRenderer: this.cellRendererFunc}
            ],
            viewSidebarActive: true
        }
        this._handleClick = this._handleClick.bind(this);
        this.hideSideBar = this.hideSideBar.bind(this);
    }
    onCellValueChanged(params) {
        const {cUID, alias} = params.data;
        if(alias.length > 3){
            this.updateDB(cUID, alias).then(rowData => rowData)
            .catch(err => console.log(err));
        }
    }
   
    //need to add react onclick listener
    cellRendererFunc(params) {
        const link = document.createElement('a');
        link.href = '#';
        link.innerText = 'schedule';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            this._handleClick()
        });
        return link;
    }

    _handleClick(){
        console.log("some API call and state change");
    }


    updateDB = async (cUID, alias) => {
        return await fetch(`/api/reports/alias`, { method: 'POST', body: JSON.stringify({cUID, alias, username: localStorage.getItem("_username")})
            ,headers: {'Content-Type':'application/json'} });
    }

    callApi = async (username) => {
        const response = await fetch(`/api/reports/${username}`, { method: 'GET', headers: {'Content-Type':'application/json'} });
        const reports = await response.json()
        let result  = reports.map(res => {
            let {title, cUID, foldername, alias} = res;
            return {title, cUID, foldername, alias}
        })
        return result;
    };

    hideSideBar(){
        this.setState({viewSidebarActive: false})
    }

    componentDidMount() {
        this.callApi('arunpalani')
            .then(rowData => this.setState({rowData}))
            .catch(err => console.log(err));
    }

    render(){
        return (
            <div>
                <div 
                  className="ag-theme-balham"
                  style={{ 
	                height: '800px', 
	                width: '900px' }} 
		            >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}
                        onCellValueChanged={this.onCellValueChanged}
                        onCellC
                        >
                    </AgGridReact>
                </div>
                <Schedule isActive={this.state.viewSidebarActive} onDismiss={this.hideSideBar}/>
            </div>
        )
    }
}

export default Home