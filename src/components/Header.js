import React from 'react';
import styled from 'styled-components';

const HeaderDiv = styled.div`
  text-align: center;
  padding-top: 2rem;
`;

function Header() {
  return (

    <HeaderDiv>
      <a href="https://twentyoverten.com" className="logo special" title="Twenty Over Ten">
        <img src="https://static.twentyoverten.com/5e72272782f81c716ccb2f52/j2ddVOharZ7/TOT_logo.PNG" alt="Twenty Over Ten" className="inverted" />
      </a>


    </HeaderDiv>
  )
}

export default Header;
