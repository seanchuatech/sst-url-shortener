import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { Resource } from 'sst'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const tableName = () => Resource.UrlTable.name

export type UrlRecord = {
  shortCode: string
  longUrl: string
  createdAt: string
  clicks: number
  expiresAt?: number
}

export const putUrl = async (record: UrlRecord): Promise<void> => {
  await docClient.send(
    new PutCommand({
      TableName: tableName(),
      Item: {
        PK: `URL#${record.shortCode}`,
        SK: 'META',
        ...record,
      },
      ConditionExpression: 'attribute_not_exists(PK)',
    }),
  )
}

export const getUrl = async (shortCode: string): Promise<UrlRecord | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableName(),
      Key: {
        PK: `URL#${shortCode}`,
        SK: 'META',
      },
    }),
  )

  if (!result.Item) return null

  return {
    shortCode: result.Item.shortCode,
    longUrl: result.Item.longUrl,
    createdAt: result.Item.createdAt,
    clicks: result.Item.clicks ?? 0,
    expiresAt: result.Item.expiresAt,
  }
}

export const incrementClicks = async (shortCode: string): Promise<void> => {
  await docClient.send(
    new UpdateCommand({
      TableName: tableName(),
      Key: {
        PK: `URL#${shortCode}`,
        SK: 'META',
      },
      UpdateExpression: 'ADD clicks :inc',
      ExpressionAttributeValues: {
        ':inc': 1,
      },
    }),
  )
}
