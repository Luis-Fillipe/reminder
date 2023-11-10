export default function Page(){
    return <div>
    <span>
      <input
        id="nascimento"
        size={20}
        /*value={props.nascimentoValue}
        onChange={event => {
          props.funcaoDoPai(event.target.value);
        }}*/
      />
      <label htmlFor="nascimento"></label>
    </span>

    {/* Fim telaNascimento */}
  </div>

}