import { EMPTY_NAME, Name, Table } from "proton-tsc";
import { AtomicAttribute } from "proton-tsc/atomicassets";

@table('claimables')
export class ClaimablesTable extends Table {

  constructor(
    public templateId: u64 = 0,
    public collectionName: Name = EMPTY_NAME,
    public activeStartTime: u64 = 0,
    public activeEndTime: u64 = 0,
    
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