import React, {Component} from 'react';
import Auth from '../helpers/auth';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            columnDefs: [
                {headerName: "Title", field: "title"},
                {headerName: "CUID", field: "cUID"},
                {headerName: "FoldeNname", field: "foldername"},
                {headerName: "alias", field: "alias", editable: true}
            ]
        }
        this.onCellValueChanged = this.onCellValueChanged.bind(this);
    }
    onCellValueChanged(params) {
        const changedData = [params.data];
        console.log(changedData)
        //params.api.updateRowData({update: changedData});
    }

    callApi = async (username) => {
        const response = await fetch(`/api/results/${username}`, { method: 'GET', headers: {'Content-Type':'application/json'} });
        const reports = await response.json()
        let result  = reports.map(res => {
            let {title, cUID, foldername} = res;
            return {title, cUID, foldername, alias: ""}
        })
        return result;
    };

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
	                width: '800px' }} 
		            >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}
                        onCellValueChanged={this.onCellValueChanged}
                        >
                    </AgGridReact>
                </div>
            </div>
        )
    }
}

export default Home