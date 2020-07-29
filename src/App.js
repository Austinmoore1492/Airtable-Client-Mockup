import React, { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components'

import Header from './components/Header';

const MainSection = styled.div`
  width: 80%;
  margin: auto;
  text-align: center;
  font-family: "AvenirNextLTPro-Bold", "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

const TrackProjectTitle = styled.div`
  color: #1FE9AE;
  font-size: 2.25rem;
  padding: 1.5rem;

  @media(max-width: 820px){
    font-size: 2rem;
  }
`;

// Styles to control the inputs
const SearchInputs = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media(max-width: 820px){
    flex-direction: column;
    align-items: normal;
  }

  > input[type="text"] {
    border-radius: 5px;
    padding: 0.5rem;
    border: none;
    min-width: 200px;
    font-size: 1rem;
  }
  @media(min-width: 820px){
    > input[type="text"]{
      margin-right: 1rem;
    }
  }
  @media(max-width: 820px){
    > input[type="text"]{
      margin-bottom: 1rem;
    }
  }

  > input[type="submit"] {
    background: #1FE9AE;
    background: linear-gradient(120deg, #08AEEA 0%, #1FE9AE 100%);
    border:none;
    border-radius: 5px;
    min-width: 200px;
    padding: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  > input[type="submit"]:hover{
    opacity: 0.8;
  }
`;

// Styles to control the information brought in from Airtable
const FilteredClientDiv = styled.div`
padding: 2rem 0;
border: 2px solid #1FE9AE;
   p {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    width: 80%;
    margin: auto;
    margin-bottom: 1rem;
  }

  @media(max-width: 820px){
    p {
      text-align: left;
    }
  }

  p:first-of-type {
    padding-top: 1rem;
  }

  a{
    color: #1FE9AE;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  a:hover{
    color: #08AEEA;
  }
`;

const FilteredPara = styled.div`
border-bottom: 2px solid #08AEEA;
    width: 80%;
    margin: auto;

  p {
    font-size: 2rem;
  }

  @media(max-width: 820px){
    p {
      font-size: 1.5rem;
      margin: 0;
    }
    >p {
      padding-bottom: 1rem;
    }
  }
`;

const PurchasedSpan = styled.p`
  span:nth-child(odd){
    color: #1FE9AE;
  }
  span:nth-child(even){
    color: #08AEEA;
  }
`;

function App() {
  // State
  const [clients, setClients] = useState([]);
  const [filteredClient, setFilteredClients] = useState();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true)

  // Initializing Airtable base
  const Airtable = require('airtable');
  const base = new Airtable({ apiKey: 'Your API Key here' }).base('Your base key goes here');

  // You can change to any table needed from the API
  const table = base("Table you want to query");

  // Get the Records Function and Set State
  const getRecords = async () => {
    const records = await table.select().all()
    setClients(records)
    setLoading(false)
  }

  // Call the Get Records Function with useEffect
  useEffect(() => {
    getRecords();
  }, []);


  return (
    <div className="App">
      <div className="hero-section">
        <Header />

        <MainSection>

          {console.log(clients)}
          <TrackProjectTitle>Track Your Twenty Over Ten Project</TrackProjectTitle>
          {/* Display loading when Clients State hasn't been set */}
          {loading === true ? (
            <h1>Loading...</h1>
          ) : (
              <Fragment>
                <p style={{ marginBottom: '1rem' }}>Enter Your Project ID</p>
                <SearchInputs>
                  <input
                    onChange={e => {

                      setSearch(e.target.value);
                    }}
                    type="text"
                    value={search}
                    placeholder="recdvyzTFlpLrAjc7"
                  />
                  <input type='submit'
                    onClick={() => {
                      const filterClients = clients.filter(client => {
                        return client.id === search;
                      });
                      setFilteredClients(filterClients);
                    }}
                    value="Search"
                  />
                </SearchInputs>
                {

                  // Filter results depending on Search Input
                  filteredClient === undefined || filteredClient === null ? (
                    <h2>Search for your project</h2>
                  ) : (
                      filteredClient.map((client, i) => (
                        <FilteredClientDiv key={`${i}`}>
                          <FilteredPara>
                            <p>{client.fields.Name}</p>
                            <p>Here's the information for your site:</p>
                          </FilteredPara>
                          <p>What Stage your site is in: <span style={{ color: "#1FE9AE" }}>{client.fields.Stage}</span></p>
                          {
                            client.fields["Assets Needed Before Start"] ?
                              (<PurchasedSpan>Assets Needed Before Start:
                                { client.fields["Assets Needed Before Start"].map((purchase, i) => (
                                  <span key={`${i}`}>{" "}{purchase}</span>
                                ))}
                              </PurchasedSpan>
                              ) : (
                                ""
                              )
                          }


                          <PurchasedSpan>Purchased:
                    {client.fields.Purchased.map((purchase, i) => (
                            <span key={`${i}`}>{" "}{purchase}</span>
                          ))}
                          </PurchasedSpan>

                          <p>Staging Site: <a href={`${client.fields["Staging Site"]}`}>{client.fields["Staging Site URL"]}</a></p>
                          <p>Project ID: <span style={{ color: "#1FE9AE" }}>{client.id}</span></p>
                        </FilteredClientDiv>
                      ))
                    )
                }
              </Fragment>
            )}

        </MainSection>
      </div>
    </div>
  );
}

export default App;
