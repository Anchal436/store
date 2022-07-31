import React from 'react';


class ScrollingWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasScrolled: false };
    this.scrollingWrapper = React.createRef(null);
  }


  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    if(!this.scrollingWrapper || !this.scrollingWrapper.current)
      return
    console.log(this.scrollingWrapper.current.scrollTop)
    if (this.scrollingWrapper.scrollTop > 100 && !this.state.hasScrolled) {
      this.setState({ hasScrolled: true });
    } else if (this.scrollingWrapper.scrollTop < 100 && this.state.hasScrolled) {
      this.setState({ hasScrolled: false });
    }
  }

  scrollToTop = () => {
    this.scrollingWrapper.scrollTop = 0;
  }

  reference = (id) => (ref) => {
    this[id] = ref;
  }

  render() {
    return (
      <>
        {this.state.hasScrolled && (
          <div className='ScrollToTopIconContainer' onClick={this.scrollToTop}>
            <div>^</div>
            <button>BACK TO TOP</button>
          </div >
        )}
        <div className='ScrollingWrapperContainer' ref={this.scrollingWrapper}>
          {this.props.children}
        </div>
      </>
    );
  }
}

export default ScrollingWrapper;

// const ScrollingWrapperContainer = styled.div`
//   overflow-y: scroll;
//   -webkit-overflow-scrolling: touch;
//   height: 100%;
//   position: relative;
// `;

// const ScrollToTopIconContainer = styled.div`
  
// `;

// const Button = styled.div`
//   background: black;
//   color: white;
//   font-family: Teko;
//   font-size: 16px;
//   line-height: 30px;
//   border-radius: 15px;
//   width: 100px;
//   padding-top: 4px;
// `;
