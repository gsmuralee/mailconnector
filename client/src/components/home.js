import React, {Component} from 'react';
import Navigation from './navigation';
import CreateSchedule from './schedule/CreateSchedule';
import { AgGridReact } from 'ag-grid-react';
import { routes } from '../config.js';
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
        this.onDelete = this.onDelete.bind(this);
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
        const method = data.scheduleId ? 'PUT' : 'POST'
        const fdata = {...data, userEmail: localStorage.getItem('_email')}
        await fetch(routes('SCHEDULE'), { method: method, body: JSON.stringify(fdata)
            ,headers: {'Content-Type':'application/json'} });
            this.hideSideBar();
            return;
    }

    onDelete = async(id) => {
        const scheduleId = id.replace('#', '')
        await fetch(routes('SCHEDULE',scheduleId), { method: 'DELETE'
            ,headers: {'Content-Type':'application/json'} });
            this.hideSideBar();
    }

    //need to add react onclick listener
    cellRendererFunc(params) {
        const link = document.createElement('a');
        link.href = '#';
        link.innerText = 'schedule';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleClick(params.data.cUID, params.data.alias)
        });
        return link;
    }

    handleClick = async (cuid, alias) => {
        if(!alias) return false;
        const response = await fetch(routes('GET_SCHEDULE',cuid), { method: 'GET', headers: {'Content-Type':'application/json'} });
        const res = await response.json()
        const schedule = res.status == 200 ? res.schedule : {};
        // const schedule = {email: 'muraligs@visualbi'}
        this.setState({viewSidebarActive: true, currentCUID: cuid, data: schedule })
    }


    updateDB = async (cUID, alias) => {
        const res =  await fetch(routes('REPORTS'), { method: 'POST', body: JSON.stringify({cUID, alias, username: localStorage.getItem("_username"), email: localStorage.getItem("_email")})
            ,headers: {'Content-Type':'application/json'} });
        const record = await res.json();
        return record
    }

    callApi = async (username) => {
        const param = `${username}?serveralias=${localStorage.getItem('_serverAlias')}`
        const response = await fetch(routes('GET_REPORTS',param), { method: 'GET', headers: {'Content-Type':'application/json'} });
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
                <Navigation history={this.props.history}/>
                <div 
                  className="ag-theme-balham grid-pos"
                  style={{
	                height: '900px', 
	                width: '1000px' }} 
		            >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}
                        onCellValueChanged={this.onCellValueChanged}
                        onCellC
                        >
                    </AgGridReact>
                </div>
                <CreateSchedule isActive={viewSidebarActive} cuid={currentCUID} onCreate={this.onCreate} onDelete={this.onDelete} onDismiss={this.hideSideBar} data={data}/>
            </div>
        )
    }
}

export default Home