import React from 'react'
import "./../css/Defi.css"
import NavTab from "./../components/NavTab"
import ShowBalance from '../components/ShowBalance'
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill } from 'react-icons/bs'
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify'
import { ethers } from 'ethers';
import {contractAddress, contractABI} from '../contracts/contract_abi';

class Defi extends React.Component {
  state = {
    useFunction: "",
    amountInput: 0,
    amountOutput: 1,
    switched: false,
    
    coinInput: "WETH",
    coinInput_img: "https://assets.coingecko.com/coins/images/17238/large/aWETH_2x.png?1626940782",

    coinOutput: "Select Token",
    coinOutput_img: "https://cdn.pixabay.com/photo/2012/04/10/23/44/question-27106_1280.png",

    tokens: [" WETH"," AVAX"," USDC"],
    tokens_img: [
    "https://assets.coingecko.com/coins/images/17238/large/aWETH_2x.png?1626940782",
    "https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=022",
    "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"],
    tokens_address: ["0x1111","0x2222","0x3333"],
    swapEnable: false,

  }
  
  switchAmounts = () => {
    this.setState({switched:!this.state.switched})
  }

  switchToken_Input = () => {
    document.getElementById("token_modal_input").style.display = "block";
  }
  switchToken_Output = () => {
    document.getElementById("token_modal_output").style.display = "block";
  }
  selectToken = (token) => {
    this.setState({selectToken:token})
  }
  closeModal = () => {
    document.getElementById("token_modal_input").style.display = "none";
    document.getElementById("token_modal_output").style.display = "none";
  }
  selectTokenInput(item,i){
    this.setState({coinInput:item})
    this.setState({coinInput_img:this.state.tokens_img[i]})
    this.closeModal()
  }
  selectTokenOutput(item,i){
    this.setState({coinOutput:item})
    this.setState({coinOutput_img:this.state.tokens_img[i]})
    this.closeModal()
  }
  allConditionsForSwap(){
    if(this.state.amountInput !== 0 && this.state.amountOutput !== 0 && this.coinInput !== "" && this.state.coinInput !== "Select Token" && this.state.coinOutput !== "" && this.state.coinOutput !== "Select Token"){
      return true;
    }
    else{
      return false;
    }
  }
  componentDidMount = () => {
    toast.configure()
    document.body.style.backgroundColor = "#504d4d"
    this.setState({useFunction:this.props.useFunction})
    if(this.props.useFunction === "Swap"){
      document.getElementById("swap").style.backgroundColor = "#504d4d"
      document.getElementById("swap").style.opacity = "100%"

    }
    else if(this.props.useFunction === "Pool"){
      document.getElementById("pool").style.backgroundColor = "#504d4d"
      document.getElementById("pool").style.opacity = "100%"
    }
    else if(this.props.useFunction === "Loan"){
      document.getElementById("loan").style.backgroundColor = "#504d4d"
      document.getElementById("loan").style.opacity = "100%"
    }
    else if(this.props.useFunction === "Vote"){
      document.getElementById("vote").style.backgroundColor = "#504d4d"
      document.getElementById("vote").style.opacity = "100%"
    }
  }
  AddLiquity = async (token1_amount,token2_amount) => {
    const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const defiContract = new ethers.Contract(contractAddress, contractABI, signer);

        let txnwait = await defiContract.provide(token1_amount,token2_amount)

        await txnwait.wait()

        defiContract.getMyHoldings().then( result => {
          toast(parseInt(result.amountToken1._hex.toString()))
          toast(parseInt(result.amountToken2._hex.toString()))
          toast(parseInt(result.myShare._hex.toString()))
        })

      }else{
        console.log("Ethereum object does not exist");
      }
  }
  Swapper = () => {
    if(this.props.useFunction === "Swap"){
      toast("Swap "+ Number(this.state.amountInput * 10**18) + " of " + this.state.coinInput)
      toast("For " + Number(this.state.amountOutput * 10**18) + " of " + this.state.coinOutput)
    }
    else if(this.props.useFunction === "Pool"){
      this.AddLiquity(Number(this.state.amountInput),Number(this.state.amountOutput ))
    }
    else if(this.props.useFunction === "Loan"){
      toast("Collaterize "+ Number(this.state.amountInput * 10**18) + " of " + this.state.coinInput)
      toast("Borrow " + Number(this.state.amountOutput * 10**18) + " of " + this.state.coinOutput)
    }
    else if(this.props.useFunction === "Vote"){
      toast("Vote "+ Number(this.state.amountInput * 10**18) + " of " + this.state.coinInput)
      toast("In " + Number(this.state.amountOutput * 10**18) + " of " + this.state.coinOutput)
    }
    
  }
  render() {
    return (
      <div>
        <NavTab></NavTab>
        <ShowBalance></ShowBalance>
        <div className='container'>
          {/* SWAP BOX */}
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossOrigin="anonymous"/>
          <div className='row-defi'>
              {this.props.useFunction === "Pool" ? 
              <button className='button_arrow_circle' onClick={this.switchAmounts}>
                <AiOutlinePlusCircle className='fa_arrow_circle'></AiOutlinePlusCircle>
              </button> 
              :
              <button className='button_arrow_circle' onClick={this.switchAmounts}>
                {this.state.switched ? <BsFillArrowUpCircleFill className='fa_arrow_circle'></BsFillArrowUpCircleFill>:<BsFillArrowDownCircleFill className='fa_arrow_circle'></BsFillArrowDownCircleFill>}
              </button>}
              
              <div className='col col-md-6 offset-md-3' id="window-defi">
                  <h4 className='text-defi'>Defi</h4>
                  <div id="form">
                      <div className="swapbox">
                                  <div className="swapbox_select token_select" id="from_token_select" onClick={this.state.switched ? this.switchToken_Output : this.switchToken_Input}>
                                    {this.state.switched ? <img className='token_select_img' alt="output-coin" src={this.state.coinOutput_img}></img>:<img className='token_select_img' alt="input-coin" src={this.state.coinInput_img}></img>}
                                    {this.state.switched ? this.state.coinOutput:this.state.coinInput}
                                  </div>
                                  <div className="swapbox_select">
                                      <input className="number form-control" value={this.state.switched ? this.state.amountOutput : this.state.amountInput}
                      onChange={(e) => this.setState({amountInput: e.target.value})} id="from_amount"/>
                                  </div>
                      </div>
                      <div className='swapbox_arrow'><BsFillArrowDownCircleFill className='swapbox_arrow_circle'/></div>
                      <div className="swapbox">
                                  <div className="swapbox_select token_select"  id="to_token_select" onClick={this.state.switched ? this.switchToken_Input : this.switchToken_Output}>
                                    {this.state.switched ? <img alt="input-coin" className='token_select_img' src={this.state.coinInput_img}></img>:<img className='token_select_img' alt="output-coin" src={this.state.coinOutput_img}></img>}
                                    {this.state.switched ? this.state.coinInput:this.state.coinOutput}
                                  </div>
                                  <div className="swapbox_select">
                                      <input className="number form-control" value={this.state.switched ? this.state.amountInput : this.state.amountOutput}
                      onChange={(e) => this.setState({amountOutput: e.target.value})} id="to_amount"/>
                                  </div>
                      </div>
                      {/* SWAP BUTTON AND GAS */}
                      
                      <div>Estimated Gas: <span id="gas_estimate"></span></div>
                      {this.allConditionsForSwap() ? <button className="btn btn-primary btn-block" onClick={this.Swapper} id="swap_button">
                          {this.state.useFunction}
                      </button> :
                      <button disabled className="btn btn-primary btn-block" onClick={this.Swapper} id="swap_button">
                          {this.state.useFunction}
                      </button>}
                  </div>
                  
                </div>
              </div>
              {/* MODAL */}
              <div className="modal" id="token_modal_input" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Select a token</h5>
                      <div type="button" className=" close-modal-defi" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                        <div id="modal_close">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div id="token_list">

                        {this.state.tokens.map( (item,i) => {
                            return(
                              <div key={i} id="token_selection" className='token_row' onClick={() => this.selectTokenInput(item,i) }>
                                <img alt={item} className='token_list_img' src={this.state.tokens_img[i]}/>
                                <span className='token_list_text' >{item}</span>
                              </div>
                            )
                        } )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal" id="token_modal_output" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Select a token</h5>
                      <div type="button" className=" close-modal-defi" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                        <div id="modal_close">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div id="token_list">

                        {this.state.tokens.map( (item,i) => {
                            return(
                              <div key={i} id="token_selection" className='token_row' onClick={() => this.selectTokenOutput(item,i) }>
                                <img alt={item} className='token_list_img' src={this.state.tokens_img[i]}/>
                                <span className='token_list_text' >{item}</span>
                              </div>
                            )
                        } )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
  }
}

export default Defi;