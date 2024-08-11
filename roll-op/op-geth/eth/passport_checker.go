package eth

import (
	"context"
	"errors"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

type ContractPassportChecker struct {
	client       *ethclient.Client
	contractAddr common.Address
}

func NewContractPassportChecker(client *ethclient.Client, contractAddr common.Address) *ContractPassportChecker {
	return &ContractPassportChecker{
		client:       client,
		contractAddr: contractAddr,
	}
}

func (c *ContractPassportChecker) CheckPassport(ctx context.Context, addr common.Address) error {
	// We'll implement this after deploying the contract
	return errors.New("not implemented")
}
