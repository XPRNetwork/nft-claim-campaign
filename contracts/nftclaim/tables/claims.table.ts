import { EMPTY_NAME, Name, Table } from "proton-tsc";


@table('claims')
export class ClaimsTable extends Table {

  constructor(
    
    public templateId: u64 = 0,
    public mintedAssetId: u64 = 0,
    public claimTime: u64 = 0,
    
  ) {
    super()
  }

  @primary 
  /**
   * Get the value of the symbol as a u64.
   * @returns {u64} - The value of the symbol.
   */
  get by_key(): u64 {
    
    return this.templateId;

  }
  /**
   * Set the value of the symbol from a u64.
   * @param {u64} value - The value to set for the symbol.
   */
  set by_key(value:u64) {
    
    this.templateId = value;

  }

}