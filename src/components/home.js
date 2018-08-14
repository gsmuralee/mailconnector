import React, {Component} from 'react';
import Auth from '../helpers/auth';
import Navigation from './navigation';
import CreateSchedule from './schedule/CreateSchedule';
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
            viewSidebarActive: false,
            currentCUID: '',
            data: {}
        }
        this.handleClick = this.handleClick.bind(this);
        this.hideSideBar = this.hideSideBar.bind(this);
    }
    onCellValueChanged(params) {
        const {cUID, alias} = params.data;
        if(alias.length > 3){
            this.updateDB(cUID, alias).then(rowData => rowData)
            .catch(err => console.log(err));
        }
    }
    onCreate = async(data) => {
        await fetch(`/api/reports/schedule`, { method: 'POST', body: JSON.stringify(data)
            ,headers: {'Content-Type':'application/json'} });
            this.hideSideBar();
            return;
    }
    //need to add react onclick listener
    cellRendererFunc(params) {
        const link = document.createElement('a');
        link.href = '#';
        link.innerText = 'schedule';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleClick(params.data.cUID)
        });
        return link;
    }

    handleClick = async (cuid) => {
        // const response = await fetch(`/api/alias/${cuid}/schedule`, { method: 'GET', headers: {'Content-Type':'application/json'} });
        // const schedule = await response.json()
        // console.log(schedule)
    const schedule = {email: 'muraligs@visualbi.com'}
        this.setState({viewSidebarActive: true, currentCUID: cuid, data: schedule })
    }


    updateDB = async (cUID, alias) => {
        const res =  await fetch(`/api/reports/alias`, { method: 'POST', body: JSON.stringify({cUID, alias, username: localStorage.getItem("_username")})
            ,headers: {'Content-Type':'application/json'} });
        const record = await res.json();
        return record
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
        this.callApi(localStorage.getItem('_username'))
            .then(rowData => this.setState({rowData}))
            .catch(err => console.log(err));
    }

    render(){
        const {viewSidebarActive, currentCUID, data} = this.state;
        return (
            <div>
                <Navigation />
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
                <CreateSchedule isActive={viewSidebarActive} cuid={currentCUID} onCreate={this.onCreate} onDismiss={this.hideSideBar} data={data}/>
            </div>
        )
    }
}

export default Home