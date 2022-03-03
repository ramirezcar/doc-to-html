function SuggestButton({className, callback, title, match}) {
  return(
    <button className={"suggest "+className} onClick={callback}>
      <b className="">{title} </b>
      <span className="">{match}</span>
  </button>
  )
}

export default SuggestButton;