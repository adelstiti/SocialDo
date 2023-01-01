
import React from 'react';
import { FadeLoader } from 'react-spinners';

const Loading = () => {
    return (
        <div className='sweet-loading'>
        <FadeLoader
          css={{margin:"0 auto"}}
          sizeUnit={"px"}
          size={150}
          color={'#009688'}
        />
      </div> 
    )
}

export default Loading
