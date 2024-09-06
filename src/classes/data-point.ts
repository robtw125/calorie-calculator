import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/controllers/firebase'

export default class DataPoint {
  id: string
  userUid: string
  caloricIntake: number
  weight: number
  private timestamp: number

  constructor(
    id: string,
    userUid: string,
    caloricIntake: number,
    weight: number,
    timestamp: number
  ) {
    this.id = id
    this.userUid = userUid
    this.caloricIntake = caloricIntake
    this.weight = weight
    this.timestamp = timestamp
  }

  getDate(): string {
    return new Date(this.timestamp).toDateString()
  }

  delete = async () => {
    const docRef = doc(db, 'data', this.id)
    await deleteDoc(docRef)
  }
}
