import React    from 'react';
import ReactDOM from 'react-dom';
import axios    from 'axios';

import './index.css';

/*
* Outermost component, displays navigation and sorting component
*/
class Puppet extends React.Component {
    render() {
        return (
            <div className="puppet">
                <div className="top-nav-box">
                    <TopNav />
                </div>
                <div className="main-container">
                    <MainBody />
                </div>
            </div>
        );
    }
}

/*
* Navigation menu
*/
class TopNav extends React.Component {
    render() {
        return(
            <div className="nav-container">
                <div className="nav-item nav-selected">Nav Item 1</div>
                <div className="nav-item">Nav Item 2</div>
                <div className="nav-item">Nav Item 3</div>
            </div>
        );
    }
}

/*
* Main component displaying and sorting
*/
class MainBody extends React.Component {
    constructor() {
        super();
        // to be populated from api
        this.data = [];
        // default state vars
        this.state = {
            currentSortField: null,
            sortAsc:          true,
            rowsPerPage:      10,
            currentPage:      1,
            currentIndex:     9,
            totalPages:       1,
            dataList: [],
            fields: {
                firstName: 'First Name',
                lastName:  'Last Name',
                country:   'Country',
                address:   'Address',
                city:      'City',
                state:     'State',
                zip:       'Zip',
                phone:     'Phone'
            }
        };
    }

    /*
    * Gets the initial 100,000 record json array from 3rd party api
    */
    populateDataList() {
        this.setState({dataList: this.data.slice(0,10)})
    }

    /*
    * Data retrieval after the component is rendered
    */
    componentDidMount() {
        //get 100,000 json entries
        axios.get(`https://ennevor-sandbox.herokuapp.com/puppet`)
            .then(res => {
                this.data = res.data;
                this.populateDataList();
            });
    }
    /*
    * Takes in selection values and makes the necessary changes when page size is updated
    */
    onChange(e) {
        this.setState({rowsPerPage: +e.target.value, dataList: this.data.slice(0, +e.target.value), currentIndex: +e.target.value - 1});
    }

    /*
    * Sort the data by a certain field. Executed when field labels are clicked
    */
    sortByField(fieldName) {
        if(fieldName === this.state.currentSortField) {
            this.setState({
                sortAsc: !this.state.sortAsc
            })
        } else {
            this.setState({
                dataList: this.data.slice(0,this.state.rowsPerPage),
                sortAsc: true,
                currentSortField: fieldName
            })
        }
        this.setState({dataList: this.data.sort((a, b) => {
                if(this.state.sortAsc) {
                    return a[fieldName] > b[fieldName] ? 1 : (a[fieldName] < b[fieldName] ? -1 : 0)
                } else {
                    return a[fieldName] < b[fieldName] ? 1 : (a[fieldName] > b[fieldName] ? -1 : 0)
                }
            }).slice(0,this.state.rowsPerPage)
        })
    }
    /*
    * Navigates through the data depending on current index, rows per page, and direction
    */
    displayPageList(forward){
        if (forward) {
            this.setState({dataList: this.data.slice(this.state.currentIndex + 1, this.state.currentIndex + this.state.rowsPerPage + 1),
                currentIndex: this.state.currentIndex + this.state.rowsPerPage
            })
        } else {
            this.setState({dataList: this.data.slice(this.state.currentIndex + 1 - (2*this.state.rowsPerPage), this.state.currentIndex - this.state.rowsPerPage + 1),
                currentIndex: this.state.currentIndex - this.state.rowsPerPage
            })
        }
    }
    /*
    * Displays the component
    */
    render() {
        return(
            <div className="list-container">
                <div className="item-options">
                    <div class="item-options-left">
                        <h1>List of Awesome</h1> | Sort by:
                        <span class="item-sort"> {this.state.fields[this.state.currentSortField] || 'n/a'}</span>
                    </div>
                    <div className="item-options-right">
                        items per page:
                        <select value={this.state.rowsPerPage} onChange={this.onChange.bind(this)} className="select-style">
                            <option value="5">  5</option>
                            <option value="10"> 10</option>
                            <option value="25"> 25</option>
                            <option value="50"> 50</option>
                            <option value="75"> 75</option>
                            <option value="100">100</option>
                        </select>
                        <span className="strong-item">
                            {this.state.currentIndex - this.state.rowsPerPage + 2} - {this.state.currentIndex + 1}</span> of <span className="strong-item">{this.data.length} </span>
                            {this.state.currentIndex + 1 - this.state.rowsPerPage <= 0 ? <span> &lt;</span> : <button onClick={() => this.displayPageList(false)} class="item-action"> &lt;</button>}
                            {this.state.currentIndex + 1 <= this.data.length - 1 ? <button onClick={() => this.displayPageList(true)} class="item-action">&gt;</button> : <span> &gt;</span>}
                     </div>
                </div>
                <div className="item-header">
                    {Object.keys(this.state.fields).map((field) => {
                        return(
                            <div className={'item-column-name ' + field} onClick={() => this.sortByField(field)}>
                                {this.state.fields[field]}
                            </div>
                        );
                    })}
                </div>
                {this.state.dataList.length <= 0 ? <div className="loading">Loading...</div> : null}
                {this.state.dataList.map(function(item, i) {
                    return(
                        <div className={'item-row' + (i % 2 ? ' even' : '')} key={i}>
                            <div className="item-column-entry">        {item.firstName}</div>
                            <div className="item-column-entry">        {item.lastName}</div>
                            <div className="item-column-entry">        {item.country}</div>
                            <div className="item-column-entry address">{item.address}</div>
                            <div className="item-column-entry">        {item.city}</div>
                            <div className="item-column-entry">        {item.state}</div>
                            <div className="item-column-entry">        {item.zip}</div>
                            <div className="item-column-entry">        {item.phone}</div>
                        </div>
                    );
                })}
            </div>
        );
    }


}

// ========================================
ReactDOM.render(
    <Puppet />,
    document.getElementById('root')
);
