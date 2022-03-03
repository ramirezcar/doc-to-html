function SuggestButton({className, callback, title, match, matchIndex}) {
  return(
    <button className={"suggest "+className} match-index={matchIndex} onClick={callback}>
      <b className="">{title} </b>
      <span className="">{match}</span>
  </button>
  )
}

export default SuggestButton;