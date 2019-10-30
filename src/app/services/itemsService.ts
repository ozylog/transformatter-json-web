import vetch from 'vetch';
import { Operator, Format } from '@src/app/contexts/ItemsContext';

const { API_URL } = process.env;

export function operate(payload: OperatePayload) {
  return vetch<OperateApiRes, OperateApiErr>(`${API_URL}/v1/jsons/operate`, {
    method: 'POST',
    payload,
    headers: {
      'Content-Type': 'application/json'
    }
  }).json();
}

export interface OperatePayload {
  outputSpace: number;
  outputStable: boolean;
  outputFormat: Format;
  operator: Operator;
  input: string;
  inputFormat: Format;
}

interface OperateApiRes {
  output: string;
}

interface OperateApiErr {
  statusCode: number;
  message: string;
}
